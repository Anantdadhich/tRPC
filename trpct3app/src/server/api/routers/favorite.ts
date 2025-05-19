import {z} from "zod" 


import {
    createTRPCRouter,
    protectedProcedure,
  } from "~/server/api/trpc";


  export const favoriteRouter=createTRPCRouter({
    //save a suggestion 
    add:protectedProcedure.input(
      z.object({
        suggestionId:z.string() 

      })
    ).mutation(
      async({ctx,input}) =>{
          return ctx.db.favorite.create({
            data:{
              suggestionId:input.suggestionId,
              userId:ctx.session.user.id,
              status:"done"
            }
          })
      }
    ) ,


    //get my saved ideas 

    mine:protectedProcedure.query(
      async ({ctx}) =>{
        return ctx.db.favorite.findMany({
          where:{
          userId:ctx.session.user.id ,
          
          },
          include:{
            suggestion:true
          }
        })
      }
    ),


    //update status
    updatestatus:protectedProcedure.input(
      z.object({
        id:z.string(),
        status:z.enum(["progress","done"])
      })
    ).mutation(
      async({ctx,input})=>{
        return ctx.db.favorite.update({
          where:{
            id:input.id ,

          },
          data:{
            status:input.status
          }
        })
      }
    )
    
,
    //remove fav 
    remove:protectedProcedure.input(
      z.object({
        id:z.string()
      })
      
    ).mutation(
      async ({ctx,input})=>{
        return ctx.db.favorite.delete({
          where:{
            id:input.id
          }
        })
      }
    )
  })

