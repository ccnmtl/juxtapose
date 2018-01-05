NODE_MODULES ?= ./node_modules
JS_SENTINAL ?= $(NODE_MODULES)/sentinal

$(JS_SENTINAL): package.json
	rm -rf $(NODE_MODULES)
	npm install
	# For some reason, the 'build' directory isn't present in react-grid-layout
	# unless I explicitly install it here:
	npm i react-grid-layout
	touch $(JS_SENTINAL)

build: $(JS_SENTINAL) build/bundle.js
	npm run build

dev: $(JS_SENTINAL)
	npm run dev

eslint: $(JS_SENTINAL)
	npm run eslint

test: $(JS_SENTINAL)
	npm run test

clean:
	rm -rf $(NODE_MODULES)

.PHONY: clean
