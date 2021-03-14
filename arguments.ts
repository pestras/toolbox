import { getValue } from "./object/get-value";
import { setValue } from "./object/set-value";

export enum CLI_VALUE_TYPE {
  BOOL = 0,
  STRING,
  LIST
};

export interface CliOption {
  type: CLI_VALUE_TYPE;
  alias?: string;
  desc?: string;
};

export interface CliCommand extends CliOption {
  commands: { [key: string]: CliCommand };
  options: { [key: string]: CliOption };
}

export interface CliInputPattern {
  commands?: { [key: string]: CliCommand };
  options?: { [key: string]: CliOption };
};

export interface CurrentInput {
  command?: string;
  value?: string[];
  options?: { [key: string]: { name: string, value: any } };
}

interface Paramerter {
  commandContext: string;
  type: CLI_VALUE_TYPE;
  desc: string;
  alies: string;
  isAlias: boolean;
}

export class CliInputs {
  private _parameters: { [key: string]: Paramerter } = {};

  public readonly args: string[];
  public input: CurrentInput = {};

  constructor(pattern: CliInputPattern, public readonly startInputIndex = 0) {
    this.args = process.argv.slice(this.startInputIndex);

    this._preparePattern(pattern);
  }

  private _preparePattern(pattern: CliInputPattern) {
    for (let optionName in pattern.options)
      this._addOption(optionName, pattern.options[optionName]);

    for (let commandName in pattern.commands)
      this._addCommand(commandName, pattern.commands[commandName]);
  }

  private _addCommand(name: string, conf: CliCommand, context = "") {
    this._parameters[name] = {
      commandContext: context,
      type: conf.type,
      alies: conf.alias,
      desc: conf.desc,
      isAlias: false
    };

    if (conf.alias) {
      this._parameters[conf.alias] = this._parameters[name];
      this._parameters[conf.alias].isAlias = true;
    }

    if (conf.commands || conf.options) {
      context += !!context ? "." + name : name;
      if (conf.commands)
        for (let commandName in conf.commands) this._addCommand(commandName, conf.commands[commandName], context);
      if (conf.options)
        for (let optionName in conf.options) this._addOption(optionName, conf.options[optionName], context);
    }
  }

  private _addOption(name: string, conf: CliOption, context = "") {
    this._parameters[name] = {
      commandContext: context,
      type: conf.type,
      alies: conf.alias,
      desc: conf.desc,
      isAlias: false
    };

    if (conf.alias) {
      this._parameters[conf.alias] = this._parameters[name];
      this._parameters[conf.alias].isAlias = true;
    }
  }

  parseArguments() {
    if (this.args.length === 0) return;

    let context = "";
  }
}