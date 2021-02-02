# this makefile is from one of the templates I have kicking around.
# It is for creating standalone programs, not libraries as we are doing here
# It will need to be modified to work for our needs

PREFIX = /
MANPREFIX = $(PREFIX)/share/man

TITLE = tpinput
MANPAGE = ${TITLE}.1.gz

SRC = ${TITLE}.c
OBJ = ${TITLE}.o

all: ${OBJ} #${MANPAGE}

%.o: %.c
	$(CC) -o $@ $<

%.gz: %
	gzip $<

install: all
	mkdir -p  $(DESTDIR)$(PREFIX)/bin
	install ${OBJ} $(DESTDIR)$(PREFIX)/bin/${TITLE}
	mkdir -p $(DESTDIR)$(MANPREFIX)/man1
	install -m 644 ${MANPAGE} $(DESTDIR)$(MANPREFIX)/man1/${MANPAGE}

uninstall:
	rm -f $(DESTDIR)$(PREFIX)/bin/${TITLE}
	rm -f $(DESTDIR)$(MANPREFIX)/man1/${MANPAGE}

clean:
	rm -f ${OBJ} ${MANPAGE}

push:
	git push origin --tags

test: 
	echo test


.PHONY: all install uninstall clean push
