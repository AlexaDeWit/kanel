import { Column, Schema, Type } from 'extract-pg-schema';
import path from 'path';
import { pipe, pluck, reject } from 'ramda';

import {
  Hook,
  ModelAdjective,
  Nominators,
  SchemaConfig,
  TypeMap,
} from './Config';
import generateCompositeTypeFile from './generateCompositeTypeFile';
import generateIndexFile from './generateIndexFile';
import generateModelFile from './generateModelFile';
import generateTypeFile from './generateTypeFile';
import getSupportedTypes from './getSupportedTypes';
import { isMatch } from './Matcher';
import { Model, TableModel, ViewModel } from './Model';
import writeFile from './writeFile';

const applyHooks = <T>(
  chain: Hook<T>[],
  src: T | undefined,
  lines: string[]
): string[] => {
  const boundChain = chain.map((f) => (l) => f(l, src));
  // @ts-ignore
  return pipe(...boundChain)(lines);
};

const processSchema = async (
  schemaConfig: SchemaConfig,
  schema: Schema,
  typeMap: TypeMap,
  modelCommentGenerator: (model: TableModel | ViewModel) => string[],
  propertyCommentGenerator: (
    column: Column,
    model: TableModel | ViewModel,
    modelAdjective: ModelAdjective
  ) => string[],
  nominators: Nominators,
  modelProcessChain: Hook<Model>[],
  typeProcessChain: Hook<Type>[],
  schemaFolderMap: { [schemaName: string]: string },
  makeIdType: (innerType: string, modelName: string) => string
): Promise<void> => {
  const { tables, views, types } = schema;

  const { compositeTypes, enumTypes } = getSupportedTypes(types);

  enumTypes.forEach((t) => {
    const typeFileLines = generateTypeFile(t, nominators.typeNominator);
    const wetTypeFileLines = applyHooks(typeProcessChain, t, typeFileLines);
    const givenName = nominators.typeNominator(t.name);
    const filename = `${nominators.fileNominator(givenName, t.name)}.ts`;
    writeFile({
      fullPath: path.join(schemaConfig.modelFolder, filename),
      lines: wetTypeFileLines,
    });
  });

  const models = [
    ...tables.map((t) => ({ ...t, type: 'table' } as const)),
    ...views.map((t) => ({ ...t, type: 'view' } as const)),
  ];

  const rejectIgnored = reject((m: { name: string }) =>
    (schemaConfig.ignore || []).some((matcher) => isMatch(m.name, matcher))
  );
  const includedModels = rejectIgnored(models);

  const userTypes = pluck('name', types);
  const tableOrViewTypes = pluck('name', includedModels);

  compositeTypes.forEach((t) => {
    const typeFileLines = generateCompositeTypeFile(t, {
      typeMap,
      userTypes,
      tableOrViewTypes,
      nominators,
      schemaName: schemaConfig.name,
      externalTypesFolder: schemaConfig.externalTypesFolder,
      schemaFolderMap,
    });
    const wetTypeFileLines = applyHooks(typeProcessChain, t, typeFileLines);
    const filename = `${nominators.fileNominator(
      nominators.typeNominator(t.name),
      t.name
    )}.ts`;
    writeFile({
      fullPath: path.join(schemaConfig.modelFolder, filename),
      lines: wetTypeFileLines,
    });
  });

  includedModels.forEach((m) => {
    const modelFileLines = generateModelFile(m, {
      modelCommentGenerator,
      propertyCommentGenerator,
      typeMap,
      userTypes,
      nominators,
      schemaName: schemaConfig.name,
      externalTypesFolder: schemaConfig.externalTypesFolder,
      schemaFolderMap,
      makeIdType,
    });
    const wetModelFileLines = applyHooks(modelProcessChain, m, modelFileLines);
    const filename = `${nominators.fileNominator(
      nominators.modelNominator(m.name),
      m.name
    )}.ts`;
    writeFile({
      fullPath: path.join(schemaConfig.modelFolder, filename),
      lines: wetModelFileLines,
    });
  });

  const indexFileLines = generateIndexFile(
    includedModels,
    userTypes,
    nominators
  );
  const wetIndexFileLines = applyHooks(
    modelProcessChain,
    undefined,
    indexFileLines
  );
  writeFile({
    fullPath: path.join(schemaConfig.modelFolder, 'index.ts'),
    lines: wetIndexFileLines,
  });
};

export default processSchema;
