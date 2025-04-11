class HelloWorld {
public:
  explicit HelloWorld() {
    try {
      kprintf("Hello, World!");
    } catch (const char* e) {
      kprintf(e);
    }
  }

  ~HelloWorld() = default;

private:
  char *video = (char*)0xb8000;

  int kprintf(const char* string) {
    unsigned short i = 0;
    unsigned short j = 0;

    while (i < (80 * 25 * 2)) {
      *(video + i) = ' ';
      *(video + (i + 1)) = 0x0f;
      i += 2;
    }

    i = (j * 80 * 2);
    while (*string != 0) {
      if (*string == '\n') {
        j += 1;
        i = (j * 80 * 2);
        string += 1;
      } else {
        *(video + i) = *string;
        *(video + (i + 1)) = 0x0f;
        string += 1;
        i += 2;
      }
    }

    return 0;
  }
};

extern "C" void kernelMain() {
  HelloWorld helloWorld;
}
