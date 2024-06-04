import {test as setup } from '@playwright/test';
// @ts-ignore
import user from '../.auth/user.json';
import * as fs from "fs";


const authFile = '.auth/user.json'

setup('authentication', async({page,request}) =>{
    // await page.goto('https://conduit.bondaracademy.com/')
    // await page.getByText('Sign in').click()
    // await page.getByRole('textbox',{name:"Email"}).fill('111')
    // await page.getByRole('textbox',{name:"Password"}).fill('111')
    // await page.getByRole('button').click()
    //
    // //Wait for the final URL to ensure that the cookies are actually set.
    // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
    //
    // await page.context().storageState({path: authFile})

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
        data: {"user":{"email":"111","password":"111"}}
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))

    process.env['ACCESS_TOKEN'] = accessToken

})