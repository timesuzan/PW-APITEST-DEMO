import {expect, request} from '@playwright/test';
// @ts-ignore
import user from '../PW-APITEST-APP/.auth/user.json';
import * as fs from "fs";


async function globalSetup(){
    const authFile = '.auth/user.json'
    const context = await request.newContext()
    const response = await context.post('https://conduit-api.bondaracademy.com/api/users/login',{
        data: {"user":{"email":"111","password":"111"}}
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))

    process.env['ACCESS_TOKEN'] = accessToken

    const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/',{
        data: {
            "article": {
                "title":"this is a test article",
                "description":"playwright",
                "body":"playwright is easy for automation",
                "tagList":["automation"]
            }
        },
        headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
        }
    })

    await expect(articleResponse.status()).toEqual(201)
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug
    process.env['SLUGID']= slugId
}

export default globalSetup;