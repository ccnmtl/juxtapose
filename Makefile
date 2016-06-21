build: node_modules/.bin/webpack
	npm run build

dev: node_modules/.bin/webpack
	npm run dev

eslint: node_modules/.bin/eslint
	npm run eslint

node_modules/.bin/webpack:
	npm install

node_modules/.bin/eslint:
	npm install
