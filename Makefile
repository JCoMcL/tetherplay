start: tpinput/tpinput webserver/node_modules/
	npm start --prefix webserver -- -s "`readlink -f $<`"

webserver/node_modules/:
	npm install --prefix `dirname $@`

tpinput/tpinput:
	${MAKE} -C tpinput TITLE=$(@F)

clean:
	${MAKE} -C tpinput clean
	rm -rf webserver/node_modules

.PHONY: start clean
