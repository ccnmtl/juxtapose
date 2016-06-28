build: node_modules/.bin/webpack build/bundle.js
	npm run build

dev: node_modules/.bin/webpack
	npm run dev

eslint: node_modules/.bin/eslint
	npm run eslint

node_modules/.bin/webpack:
	npm install

node_modules/.bin/eslint:
	npm install

clean:
	rm -rf node_modules

.PHONY: clean
