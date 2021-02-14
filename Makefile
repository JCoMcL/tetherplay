CFLAGS = -I/usr/include/libevdev-1.0
LDFLAGS = `pkg-config --static --libs libevdev`

TITLE = tpinput
SRC = src/tpinput.c src/device.c
OBJ = ${SRC:.c=.o}

${TITLE}: setup ${OBJ}
	cc -o $@ ${OBJ} ${LDFLAGS}

%.h: %.c
	makeheaders $<

%.o: %.c
	cc -c ${CFLAGS} $< -o $@

setup: ${SRC:.c=.h}

clean:
	-rm -f ${OBJ} ${SRC:.c=.h} ${TITLE}

test: ${TITLE}
	./$< --name="js0" < test.json #gp-ljoy:dir4 gp-south:bool gp-west:bool gp-start:inst

.PHONY: setup clean test
