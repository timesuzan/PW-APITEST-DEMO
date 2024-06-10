import { test, expect } from '@playwright/test';
// @ts-ignore
import tags from "../test-data/tags.json"

test.beforeEach(async ({page}) =>{

  await page.route('https://conduit-api.bondaracademy.com/api/tags', async route =>{
    await route.fulfill({

      body: JSON.stringify(tags)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')

})

test('has title', async ({ page }) => {

  await page.route('https://conduit-api.bondaracademy.com/api/articles*', async route =>{
    const response = await route.fetch()
    let responseBody = await response.json()
    responseBody.articles[0].title = "this is a pw title"
    responseBody.articles[0].description = "this is a pw description"
    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.getByText('Global Feed').click()

  await expect(page.locator('[class="navbar-brand"]')).toHaveText('conduit');
  const slowExpect = expect.configure({ timeout: 10000 });
  await slowExpect(page.locator('app-article-list h1').first()).toContainText('this is a pw title')
  await slowExpect(page.locator('app-article-list p').first()).toContainText('this is a pw description')
});

test('delete article', async({page,request}) =>{


  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
    data: {"article":{"title":"this is a test article","description":"playwright","body":"playwright is easy for automation","tagList":["automation"]}}
  })

  await expect(articleResponse.status()).toEqual(201)
  await page.getByText('Global Feed').click()
  await page.getByText('this is a test article').click()
  await page.getByRole('button',{name:'Delete Article'}).first().click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).not.toContainText('this is a test article')

})

test('create article', async ({page,request}) =>{
  await page.getByText('New Article').click()
  await page.getByRole('textbox',{name:"Article Title"}).fill('Playwright tutorial')
  await page.getByRole('textbox',{name:"What\'s this article about?"}).fill('how to start a playwright demo')
  await page.getByRole('textbox',{name:"Write your article (in markdown)"}).fill('1. set up the playwright architecture' +
      '2. write the test script')
  await page.getByRole('textbox',{name:"Enter tags"}).fill('automation test')
  await page.getByRole('button',{name:'Publish Article'}).click()


  const insertArticleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/*')
  const insertArticleResponseBody = await insertArticleResponse.json()
  const slugId = insertArticleResponseBody.article.slug

  await expect(page.locator('.article-page h1')).toContainText('Playwright tutorial')


  const articleResponse = await request.post(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)


})

