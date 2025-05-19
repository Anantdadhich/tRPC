import { createTRPCClient, httpBatchLink, httpSubscriptionLink, splitLink } from "@trpc/client"
import type { AppRouter } from "../server"




const trpcclient=createTRPCClient<AppRouter>({
  links:[
   httpBatchLink({
    url:"http://localhost:3000 " 
   })
  ]
})

async function main() {
    const user=await trpcclient.UserById.query("1") 
    
    console.log("user find",user)
    const createuser=await trpcclient.Usercreate.mutate({
        name:"random"
    })
    console.log("user create",createuser)
   
}
main()