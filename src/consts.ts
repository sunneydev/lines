type Language = {
  name: string;
  extension: string;
  icon: string;
  count?: number;
};

export const Languages: Language[] = [
  {
    name: "JavaScript",
    extension: "js",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_js_official.svg",
  },
  {
    extension: "ts",
    name: "TypeScript",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_typescript_official.svg",
  },
  {
    extension: "tsx",
    name: "TypeScript React",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_reactts.svg",
  },
  {
    extension: "jsx",
    name: "JavaScript React",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_reactjs.svg",
  },
  {
    extension: "html",
    name: "HTML",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_html.svg",
  },
  {
    extension: "css",
    name: "CSS",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_css.svg",
  },
  {
    extension: "py",
    name: "Python",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_python.svg",
  },
  {
    extension: "go",
    name: "Go",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_go.svg",
  },
  {
    extension: "dart",
    name: "Dart",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_dartlang.svg",
  },
  {
    extension: "cs",
    name: "C#",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_csharp.svg",
  },
  {
    extension: "java",
    name: "Java",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_java.svg",
  },
  {
    extension: "kt",
    name: "Kotlin",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_kotlin.svg",
  },
  {
    extension: "rb",
    name: "Ruby",
    icon: "https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_ruby.svg",
  },
];
