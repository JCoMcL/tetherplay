CFLAGS = -I/usr/include/libevdev-1.0
LDFLAGS = `pkg-config --static --libs libevdev`

TITLE = tpinput
SRC = src/tpinput.c src/device.c src/json_api.c
OBJ = ${SRC:.c=.o}

${TITLE}: ${OBJ}
	cc -o $@ ${OBJ} ${LDFLAGS}

%.o: %.c
	cc -c ${CFLAGS} $< -o $@

clean:
	-rm -f ${OBJ} ${TITLE}

test: ${TITLE}
	./$< <test.json

visual-test: ${TITLE}
	 awk '{print $0; system("sleep .3");}' test.json | ./tpinput &
	 sleep 0.3
	 jstest /dev/input/js0

.PHONY: setup clean test
