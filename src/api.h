#include <stdbool.h>

// using a struct instead of array to avoid need for malloc
typedef struct {
	int x;
	int y;
} vec;

typedef union {
	bool b;
	int i;
	vec v;
} api_value;

typedef struct {
	int recipient_id;
	api_value val;
} api_instruction;

api_instruction decode (char *input);
