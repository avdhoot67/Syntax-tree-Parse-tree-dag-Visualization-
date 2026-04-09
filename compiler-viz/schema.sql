CREATE DATABASE IF NOT EXISTS compiler_viz;
USE compiler_viz;

CREATE TABLE IF NOT EXISTS analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expression VARCHAR(500) NOT NULL,
  tokens JSON,
  parse_tree JSON,
  syntax_tree JSON,
  dag JSON,
  tac JSON,
  quadruples JSON,
  triples JSON,
  optimized JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
