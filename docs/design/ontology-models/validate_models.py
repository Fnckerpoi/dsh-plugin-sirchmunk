#!/usr/bin/env python3
import json, pathlib, yaml
ROOT=pathlib.Path(__file__).parent
FILES={'OBJECT':'m1-object-model.yaml','BEHAVIOR':'m2-behavior-model.yaml','RULE':'m3-rule-model.yaml','ACTOR':'m5-actor-model.yaml','FLOW':'m6-flow-model.yaml','REPORT':'m7-report-model.yaml','UI':'mu-ui-model.yaml'}
class NoDupLoader(yaml.SafeLoader): pass
def mapping(loader,node,deep=False):
 out={}
 for k,v in node.value:
  key=loader.construct_object(k,deep=deep)
  if key in out: raise ValueError(f'duplicate key: {key}')
  out[key]=loader.construct_object(v,deep=deep)
 return out
NoDupLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,mapping)
errs=[]; docs={}
for mt,fn in FILES.items():
 try:
  docs[mt]=yaml.load((ROOT/fn).read_text(),Loader=NoDupLoader)
  if docs[mt].get('model_type')!=mt: errs.append(f'{fn}: model_type')
 except Exception as e: errs.append(f'{fn}: {e}')
try:
 manifest=json.loads((ROOT/'manifest.json').read_text())
 for fn in manifest['models'].values():
  if not (ROOT/fn).is_file(): errs.append(f'manifest missing {fn}')
except Exception as e: errs.append(f'manifest: {e}')
if not errs:
 aggs={x['id'] for x in docs['OBJECT']['aggregates']}; bs=docs['BEHAVIOR']['behaviors']; bids=[x['id'] for x in bs]; bset=set(bids)
 roles={x['roleId'] for x in docs['ACTOR']['roles']}; perms={x['permissionId'] for x in docs['ACTOR']['permissions']}; rules={x['id'] for x in docs['RULE']['rules']}
 reps=docs['REPORT']['query_reports']; repids={x['id'] for x in reps}
 screens=docs['UI']['screens']; uirefs={a['behaviorRef'] for s in screens for a in s.get('actions',[]) if a.get('behaviorRef')}
 ids=[]
 for seq,key in [(docs['OBJECT']['aggregates'],'id'),(bs,'id'),(docs['RULE']['rules'],'id'),(docs['ACTOR']['roles'],'roleId'),(docs['ACTOR']['permissions'],'permissionId'),(docs['FLOW']['flows'],'id'),(reps,'id'),(screens,'screenId')]: ids += [x[key] for x in seq]
 if len(ids)!=len(set(ids)): errs.append('stable IDs not globally unique')
 for b in bs:
  if b['ownerEntity'] not in aggs: errs.append(f"bad owner {b['id']}")
  if b.get('triggerType')=='USER_ACTION' and b['id'] not in uirefs: errs.append(f"USER_ACTION uncovered {b['id']}")
  for p in b.get('requiredPermissions',[]):
   if p not in perms: errs.append(f"bad permission {p}")
  for t in b.get('syncTriggers',[]):
   if t['behaviorRef'] not in bset: errs.append(f"bad sync target {t['behaviorRef']}")
   elif next(x for x in bs if x['id']==t['behaviorRef'])['ownerEntity']==b['ownerEntity']: errs.append(f"same-aggregate sync {b['id']}")
 q=[b for b in bs if b.get('queryReportRef')]
 if len(q)!=7 or len(reps)!=7: errs.append('Q/REP count != 7')
 for b in q:
  if b['queryReportRef'] not in repids or sum(r['behaviorRef']==b['id'] for r in reps)!=1: errs.append(f"Q/REP mismatch {b['id']}")
 for r in reps:
  if sum(b.get('queryReportRef')==r['id'] for b in bs)!=1: errs.append(f"REP reverse mismatch {r['id']}")
  if sum(bool(s.get('primary')) for s in r['sourceObjects'])!=1: errs.append(f"REP primary {r['id']}")
 for s in screens:
  for a in s.get('actions',[]):
   if a.get('behaviorRef') not in bset: errs.append(f"bad UI ref {s['screenId']}")
  for e in s.get('elements',[]):
   if e.get('dataSource') and e['dataSource'] not in repids: errs.append(f"bad UI datasource {e['dataSource']}")
 flows=docs['FLOW']['flows']; fids={f['id'] for f in flows}; graph={f['id']:[] for f in flows}
 for f in flows:
  acts={a['activityId']:a for a in f['activities']}
  if f['startActivity'] not in acts: errs.append(f"bad start {f['id']}")
  if any(x not in acts or acts[x]['activityType']!='END' for x in f['endActivities']): errs.append(f"bad ends {f['id']}")
  seen=set(); stack=[f['startActivity']]
  while stack:
   x=stack.pop();
   if x in seen: continue
   seen.add(x); a=acts[x]
   nxt=a.get('nextActivities',[])+[z['targetActivity'] for z in a.get('branches',[])]
   for n in nxt:
    if n not in acts: errs.append(f"bad activity ref {f['id']}:{n}")
    else: stack.append(n)
   if a.get('roleRef') and (a['roleRef'] not in roles or a['roleRef'] not in f.get('roleRefs',[])): errs.append(f"bad role ref {a['roleRef']}")
   if a.get('behaviorRef') and a['behaviorRef'] not in bset: errs.append(f"bad flow behavior {a['behaviorRef']}")
   if a.get('ruleRef') and a['ruleRef'] not in rules: errs.append(f"bad rule {a['ruleRef']}")
   if a.get('subFlowRef'): graph[f['id']].append(a['subFlowRef'])
  if set(acts)-seen: errs.append(f"unreachable activities {f['id']}: {set(acts)-seen}")
  # every reachable node must reach an end
  rev={x:[] for x in acts}
  for x,a in acts.items():
   for n in a.get('nextActivities',[])+[z['targetActivity'] for z in a.get('branches',[])]: rev[n].append(x)
  can=set(f['endActivities']); st=list(can)
  while st:
   for p in rev[st.pop()]:
    if p not in can: can.add(p); st.append(p)
  if seen-can: errs.append(f"cannot reach end {f['id']}: {seen-can}")
 visiting=set(); done=set()
 def dfs(x):
  if x in visiting: errs.append('subflow cycle'); return
  if x in done:return
  visiting.add(x)
  for y in graph[x]:
   if y not in fids: errs.append(f'bad subflow {y}')
   else: dfs(y)
  visiting.remove(x);done.add(x)
 for x in graph:dfs(x)
 for role in docs['ACTOR']['roles']:
  for p in role.get('permissions',[]):
   if p not in perms: errs.append(f'bad role permission {p}')
 for p in docs['ACTOR']['permissions']:
  if p['targetType']=='BEHAVIOR' and p['targetRef'] not in bset: errs.append(f"bad permission target {p['targetRef']}")
print('PASS' if not errs else 'FAIL')
print(f'files=8 aggregates={len(docs.get("OBJECT",{}).get("aggregates",[]))} behaviors={len(docs.get("BEHAVIOR",{}).get("behaviors",[]))} reports={len(docs.get("REPORT",{}).get("query_reports",[]))} screens={len(docs.get("UI",{}).get("screens",[]))} flows={len(docs.get("FLOW",{}).get("flows",[]))}')
for e in errs: print('ERROR:',e)
raise SystemExit(bool(errs))
