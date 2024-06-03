import {test as setup } from '@playwright/test'
// @ts-ignore
const authFile = '.auth/user.json'

setup('authentication', async({page}) =>{
    await page.goto('https://conduit.bondaracademy.com/')
    await page.getByText('Sign in').click()
    await page.getByRole('textbox',{name:"Email"}).fill('111')
    await page.getByRole('textbox',{name:"Password"}).fill('111')
    await page.getByRole('button').click()

    //Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

    await page.context().storageState({path: authFile})
})