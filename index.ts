import { promises as fs } from "fs";
import * as path from "path";

// 定义性别概率的接口
interface GenderProbability {
  gender: string;
  probability: number;
}

// 定义字符的性别频率接口
interface CharFrequency {
  [char: string]: [number, number];
}

let maleTotal: number = 0;
let femaleTotal: number = 0;
let freq: CharFrequency = {};

async function loadModel(): Promise<void> {
  const filePath = path.join(__dirname, "charfreq.csv");
  const data = await fs.readFile(filePath, { encoding: "utf-8" });
  const lines = data.split("\n").slice(1); // Skip header
  lines.forEach(line => {
    if (line.trim()) {
      const [char, male, female] = line.split(",");
      const maleCount = parseInt(male, 10);
      const femaleCount = parseInt(female, 10);
      maleTotal += maleCount;
      femaleTotal += femaleCount;
      freq[char] = [femaleCount, maleCount];
    }
  });

  const total = maleTotal + femaleTotal;
  Object.keys(freq).forEach(char => {
    const [female, male] = freq[char];
    freq[char] = [female / femaleTotal, male / maleTotal];
  });
}

function guess(name: string): GenderProbability {
  const firstname: string = name.slice(1);
  firstname.split("").forEach(char => {
    if (char < "\u4e00" || char > "\u9fa0") {
      throw new Error("姓名必须为中文");
    }
  });

  const pf: number = probForGender(firstname, 0);
  const pm: number = probForGender(firstname, 1);

  if (pm > pf) {
    return { gender: "male", probability: pm / (pm + pf) };
  } else if (pf > pm) {
    return { gender: "female", probability: pf / (pm + pf) };
  } else {
    return { gender: "unknown", probability: 0 };
  }
}

function probForGender(firstname: string, gender: number): number {
  let p: number = gender === 0 ? femaleTotal / (maleTotal + femaleTotal) : maleTotal / (maleTotal + femaleTotal);
  firstname.split("").forEach(char => {
    const [female, male] = freq[char] || [0, 0];
    p *= gender === 0 ? female : male;
  });
  return p;
}

// 对外暴露的接口
async function predictGender(name: string): Promise<GenderProbability> {
  await loadModel();
  return guess(name);
}

// 用法示例
// predictGender("李丽")
//   .then(result => console.log(result))
//   .catch(err => console.error(err));

export { predictGender };