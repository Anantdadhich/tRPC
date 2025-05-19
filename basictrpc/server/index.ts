import { db } from "./db";
import { publicProcedure, router } from "./trpc";
import {z} from "zod"
import { createHTTPServer } from "@trpc/server/adapters/standalone";
const appRouter=router({
    UserList:publicProcedure.query(
      async()=>{
        const users=await db.user.findMany()
        return users
      }
    ),


    UserById:publicProcedure.input(z.string()).query(
      async(ops)=>{
        const {input} =ops 

        const users=await db.user.findById(input) 
        return users 
      }
    ),


    Usercreate:publicProcedure.input(z.object({
      name:z.string()
    })).mutation(
      async(ops)=>{
        const {input}=ops ;
        
        const users=await db.user.create(input) 
        return users
      }
    )
})

export type AppRouter=typeof appRouter

const server=createHTTPServer(
  {
    router:appRouter
  }
)

server.listen(3000) 