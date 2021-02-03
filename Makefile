PREFIX = /usr
MANPREFIX = $(PREFIX)/share/man

TITLE = tpinput
MANPAGE = ${TITLE}.1.gz
EXE = target/debug/${TITLE}

${EXE}:
	cargo build

clean:
	cargo clean

test: ${EXE}
	$< --name="js0" gp-ljoy:dir4 gp-south:bool gp-west:bool gp-start:inst

.PHONY: all install uninstall clean push
