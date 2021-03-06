#include <stdbool.h>
#include <stdio.h>

// using a struct instead of array to avoid need for malloc
typedef struct {
	int x;
	int y;
} vec;

typedef union {
	void *inst;
	bool b;
	int i;
	vec v;
} api_value;

typedef struct {
	int recipient_id;
	api_value value;
} api_instruction;

/**
 * @param input An api_instuction encoded as a string
 * @return on success; decoded input, on faliure; an api_instruction whose "recipeint_id" field is a negative errno
 */
api_instruction decode (char *input);
