class HelloWorld {
public:
  explicit HelloWorld() {
    try {
      if (kernelInit() != 0) {
        throw "Could not init kernel";
      }

      if (loadModules() != 0) {
        throw "Could not load kernel modules";
      }
    } catch (const char *&e) {
      kernelError(e);
    }
  }

  ~HelloWorld() = default;

private:
  char *video = (char *)0xb8000;

  int kernelInit() {
    unsigned int i = 0;
    unsigned int j = 0;

    while (i < (80 * 25 * 2)) {
      *(video + i) = ' ';
      *(video + (i + 1)) = 0x07;
      i += 2;
    }

    const char *string = "Oiee :3";
    i = (j * 80 * 2);

    while (*string != 0) {
      if (*string == '\n') {
        j += 1;
        i = (j * 80 * 2);
        string += 1;
      } else {
        *(video + i) = *string;
        *(video + (i + 1)) = 0x07;
        string += 1;
        i += 2;
      }
    }

    return 0;
  }

  void kernelError(const char *&e) {
    unsigned int i = 0;
    unsigned int j = 0;

    while (i < (80 * 25 * 2)) {
      *(video + i) = ' ';
      *(video + (i + 1)) = 0x07;
      i += 2;
    }

    i = (j * 80 * 2);

    while (*e != 0) {
      if (*e == '\n') {
        j += 1;
        i = (j * 80 * 2);
        e += 1;
      } else {
        *(video + i) = *e;
        *(video + (i + 1)) = 0x07;
        e += 1;
        i += 2;
      }
    }
  }

  int loadModules() {
    return 0;
  }
};

extern "C" void kernelMain() {
  HelloWorld helloWorld;
}