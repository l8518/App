import json
import glob
import os

fo = open("data/faces.json")
faces = json.load(fo)
fo.close()
ids = {}
for f in faces:
    if f["imgid"] not in ids.keys():
        ids[f"{f['imgid']}.jpg"] = 1
files = glob.glob(os.path.join("app", "static", "img", "portraits", "*.jpg"))

i = 0
for f in files:
    fn = os.path.basename(f)
    if fn not in ids.keys():
        os.remove(f)

