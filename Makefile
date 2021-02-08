CFLAGS = -I/usr/include/libevdev-1.0
LDFLAGS = `pkg-config --static --libs libevdev`

PREFIX = /usr
MANPREFIX = $(PREFIX)/share/man

TITLE = tpinput
MANPAGE = ${TITLE}.1.gz
EXE = target/debug/${TITLE}
LIB = src/lib

${EXE}: ${LIB}/device.rs
	cargo build

%.h: %.c
	makeheaders $<

%.rs: %.h
	bindgen $< > $@

%.a: %.c %.h
	cc $(CFLAGS) -o $@ $< $(LDFLAGS)

clean:
	rm ${EXE}

test: ${EXE}
	$< --name="js0" < test.json #gp-ljoy:dir4 gp-south:bool gp-west:bool gp-start:inst

.PHONY: clean test
