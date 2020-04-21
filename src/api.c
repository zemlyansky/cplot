#include <stdio.h>
#include "api.h"
#include "../charter/src/parser.h"
#include "../charter/src/renderer.h"

char* charter (char* str) {
  chart* parsed = parse_chart(str);
  char* svg = chart_to_svg(parsed);
  chart_free(parsed);
  return svg;
}
