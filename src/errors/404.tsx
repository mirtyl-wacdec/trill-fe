import Post
 from "../column/post/Post"

export default function(){
  const node = {
    "post": {
        "signature": {
            "signature": "0vgpeo.rcjis.55lsg.9oisu.cfh2h.5fk08.svl6e.1qpjb.hd7s1.77hdn.klb8m.m84to.5o289.kqn7k.sd75i.2e21f.17096.bsld1.g547e.7o9n9.msnl7.u6q40.rcg3p.upt8f.4al08.oomdi.1v401",
            "life": 1,
            "ship": "zod"
        },
        "author": "~zod",
        "parent": null,
        "contents": [
            {
                "text": "Wrong URL, nothing to see here"
            }
        ],
        "host": "~zod",
        "hash": "0v1.1ithm.p75oa.bbp0j.h5pso.v252a",
        "thread": "170141184505629959368008483832422465536",
        "time": 182992
    },
    "engagement": {
        "shared": [],
        "quoted": [],
        "reacts": {}
    },
    "id": "170141184505629959368008483832422465536",
    "children": []
  }
  return (
    <div id="main-column">
    <header>
      <h4 id="column-title">404</h4>
    </header>
    <div id="feed">
     <Post node={node} fake={true}/>
      </div>
    </div>
  )
}