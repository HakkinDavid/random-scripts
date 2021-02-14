#include <iostream>
#include <windows.h>
#include <string>

int main () {
  SetConsoleOutputCP(CP_UTF8);
  std::string temas[5] = {
    "Tecnologías programables contra las tradicionales.", "¿Qué es el código?", "Lenguajes de programación.", "Aplicación en el mundo real.", "Respondiendo dudas."
  };
  for (int i = 0; 5 > i; i++) {
    std::cout << "Tema " << i+1 << ": " << temas[i] << "\n";
    std::cin.get();
  }
}
