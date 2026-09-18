namespace lab {
struct Base { virtual int call() { return 1; } };
#if MODE == 1
int selected(){return 11;}
#else
int selected(){return 22;}
#endif
int invoke(Base& b){ return b.call(); }
}
