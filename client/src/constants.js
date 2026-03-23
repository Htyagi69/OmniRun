export  const Language={
    cpp:'C++',
    javascript:'Javascript',
    c:'C',
    python:'Python',
    java:'Java'
};

export const  StarterCode={
    javascript: `function main() {
  console.log("Hello, World!");
}
main();`,

  c: `#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`,

  python: `def main():
  print("Hello, World!")

if __name__ == "__main__":
  main()`,
  
  java:`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
}

export const FileTypeImage={
  jsx:`react.svg`,
  css:`css.svg`,
  json:`json.svg`,
  html:`html.svg`,
  js:`js.svg`
}