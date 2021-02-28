#include <stdio.h>
#include <stdlib.h>
#include <error.h>
#include <errno.h>

#define RED(s) "\e[91m" s "\e[39m"

#define error(status, msg) error(status, errno, RED(msg))

#define RETURN_IF_TRUE(expr, error_num) if(expr) {errno = error_num; return -error_num;}

#define RETURN_IF_FALSE(expr, error_num) RETURN_IF_TRUE(!expr, error_num)

#define RETURN_IF_ERROR(expr, error_num) RETURN_IF_FALSE(expr == 0, error_num)
#define RETURN_IF_ERRNO(expr) int result = expr; RETURN_IF_ERROR(result, result > 0 ? -result : result)
