import { NextRequest, NextResponse } from 'next/server';
import { Tokenizer, Parser, DAGBuilder, TACGenerator, Optimizer } from '@/lib/compiler';

export async function POST(req: NextRequest) {
  try {
    const { expression } = await req.json();

    if (!expression || typeof expression !== 'string') {
      return NextResponse.json(
        { error: 'Expression is required' },
        { status: 400 }
      );
    }

    // Tokenize
    const tokenizer = new Tokenizer(expression);
    const { tokens, errors: tokenErrors } = tokenizer.tokenize();

    if (tokenErrors.length > 0) {
      return NextResponse.json({ errors: tokenErrors }, { status: 400 });
    }

    // Parse Tree
    const parser1 = new Parser([...tokens]);
    const { tree: parseTree, errors: parseErrors } = parser1.buildParseTree();

    if (parseErrors.length > 0) {
      return NextResponse.json(
        { tokens, errors: parseErrors },
        { status: 400 }
      );
    }

    // AST
    const parser2 = new Parser([...tokens]);
    const { ast: syntaxTree, errors: astErrors } = parser2.buildAST();

    if (astErrors.length > 0) {
      return NextResponse.json(
        { tokens, parseTree, errors: astErrors },
        { status: 400 }
      );
    }

    // DAG
    const dagBuilder = new DAGBuilder();
    const dag = syntaxTree ? dagBuilder.build(syntaxTree) : [];

    // TAC
    const tacGen = new TACGenerator();
    const { tac, quadruples, triples } = syntaxTree
      ? tacGen.generate(syntaxTree)
      : { tac: [], quadruples: [], triples: [] };

    // Optimize
    const optimizer = new Optimizer();
    const optimization = tac.length > 0 ? optimizer.optimize(tac) : null;

    return NextResponse.json({
      expression,
      tokens,
      parseTree,
      syntaxTree,
      dag,
      tac,
      quadruples,
      triples,
      optimization,
      errors: [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
