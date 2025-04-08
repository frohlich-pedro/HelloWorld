class HelloWorld {
public:
  explicit HelloWorld() {
    try {
      if (kernelInit() != 0) {
        throw -1;
      }
    } catch (const char*& e) {
      /* Implementar lógica de tratamento de erro */
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

    const char *string = " __   __  _______  ___      ___      _______  _     _  _______  ______    ___      ______          _______  _______ \n|  | |  ||       ||   |    |   |    |       || | _ | ||       ||    _ |  |   |    |      |        |       ||       |\n|  |_|  ||    ___||   |    |   |    |   _   || || || ||   _   ||   | ||  |   |    |  _    | ____  |   _   ||  _____|\n|       ||   |___ |   |    |   |    |  | |  ||       ||  | |  ||   |_||_ |   |    | | |   ||____| |  | |  || |_____ \n|       ||    ___||   |___ |   |___ |  |_|  ||       ||  |_|  ||    __  ||   |___ | |_|   |       |  |_|  ||_____  |\n|   _   ||   |___ |       ||       ||       ||   _   ||       ||   |  | ||       ||       |       |       | _____| |\n|__| |__||_______||_______||_______||_______||__| |__||_______||___|  |_||_______||______|        |_______||_______|";
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

  int loadModules() {


    return 0;
  }
};

extern "C" void kernelMain() {
  HelloWorld helloWorld;
}