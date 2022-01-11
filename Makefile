NODE_MODULES ?= ./node_modules
JS_SENTINAL ?= $(NODE_MODULES)/sentinal

$(JS_SENTINAL): package.json
	rm -rf $(NODE_MODULES) package-lock.json
	npm install
	touch $(JS_SENTINAL)

build: $(JS_SENTINAL) build/bundle.js
	NODE_ENV="production" npm run build

dev: $(JS_SENTINAL)
	NODE_ENV="development" npm run dev

eslint: $(JS_SENTINAL)
	npm run eslint

test: $(JS_SENTINAL)
	NODE_ENV="test" NODE_OPTIONS=--unhandled-rejections=warn npm run test

clean:
	rm -rf $(NODE_MODULES) build

.PHONY: clean
