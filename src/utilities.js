import { promises as fs } from "fs";
import { v4 as uuidv4 } from 'uuid';

export const getNewId = () => uuidv4();

export const getJSONFromFile = async (path) => {
    try {
      await fs.access(path);
    } catch (error) {
      return [];
    }
    const content = await fs.readFile(path, "utf-8");
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`el archivo ${path} no tiene un formato JSON válido.`);
    }
  };
  
export const saveJSONToFile = async (path, data) => {
    const content = JSON.stringify(data, null, 2);
    try {
      await fs.writeFile(path, content, "utf-8");
    } catch (error) {
      throw new Error(`el archivo ${path} no pudo ser escrito.`);
    }
  };
  