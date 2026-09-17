#include "model.hpp"
namespace lab { int twice(int n){return n+n;} double twice(double n){return n+n;} int entry(){return twice(2);} int indirect(int(*fn)(int)){return fn(2);} }
