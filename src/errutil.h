#include <stdio.h>
#include <stdlib.h>
#include <error.h>
#include <errno.h>

#define RED(s) "\e[91m" s "\e[39m"

#define error(status, msg) error(status, errno, RED(msg))
