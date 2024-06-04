import {test as setup, expect} from '@playwright/test'

setup('create new article', async({page,request}) =>{
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
        data: {"article":{"title":"this is a test article","description":"playwright","body":"playwright is easy for automation","tagList":["automation"]}}
    })

    await expect(articleResponse.status()).toEqual(201)
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug
    process.env['SLUGID']= slugId
})