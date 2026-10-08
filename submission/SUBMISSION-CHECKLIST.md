# Submission checklist - April Mark Sarmiento, INF233

Read against all 37 pages of the supplied ShowCase guide. Activity 1 was already completed by the student.

## Activity 2 - required evidence

- Cover page with April Mark Sarmiento and INF233.
- Atlas Clusters screenshot showing Cluster0.
- Atlas Database Access screenshot showing the database user (hide passwords).
- Atlas Network Access screenshot showing the required network entry as Active.
- VS Code screenshot with the expanded server folder: config/db.js, models/Product.js, controllers/productController.js, routes/productRoutes.js, server.js, .env.example, package.json.
- Screenshot of server/package.json showing ES module type, dependencies, and start script.

## Activity 3 - required evidence

- Cover page with actual GitHub, Render API, and Vercel website URLs.
- Public GitHub repository screenshot showing client, server, .gitignore, README, and clear commits.
- Render dashboard screenshot showing Live.
- Six Thunder Client screenshots using the actual Render URL. Each screenshot should show method, URL, status, and response.
- Vercel dashboard screenshot showing Ready.
- Live website screenshot with at least five products and images.
- A real photo of that same live website open on a physical phone. Browser mobile emulation does not replace this photo.

## Six Thunder Client tests, in order

Use Render's real base URL, not localhost. Set Body type to JSON for POST and PUT.

1. POST /api/products: use test-product.json; expect 201. Copy returned _id.
2. GET /api/products: expect 200 and the created product.
3. GET /api/products/RETURNED_ID: expect 200.
4. PUT /api/products/RETURNED_ID with {"price":199}: expect 200 and price 199.
5. DELETE /api/products/RETURNED_ID: expect 200.
6. POST /api/products with {"name":"x","price":1}: expect 400 because image is required.

## Final checks

- Add, edit (including replacement image), and delete work on the live website.
- Products remain after refresh and appear on another device.
- Uploaded images above 1MB and unsupported file types show an error.
- README and cover page contain the real live URLs.
- No .env, database credentials, or node_modules in GitHub or submission ZIP.
- Do not submit this checklist as proof that pending deployment checks passed.

## Deployment settings

Render: Node; main branch; Singapore; server root; npm ci build; npm start; free instance; MONGO_URI set privately.

Vercel: client root; Vite; npm run build; dist output; VITE_API_URL set to the real Render origin.

Atlas: retain Cluster0; database showcase; collection products. Do not change access settings solely to capture a screenshot.
