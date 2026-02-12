import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const membersDir = join(process.cwd(), 'src/content/members');

describe('Member Content', () => {
  const memberFiles = readdirSync(membersDir).filter(f => f.endsWith('.md'));

  it('should have at least one member', () => {
    expect(memberFiles.length).toBeGreaterThan(0);
  });

  memberFiles.forEach((file) => {
    describe(`Member: ${file}`, () => {
      const content = readFileSync(join(membersDir, file), 'utf-8');
      const frontmatter = content.split('---')[1];

      it('should have required name field', () => {
        expect(frontmatter).toMatch(/name:\s*.+/);
      });

      it('should have required description field', () => {
        expect(frontmatter).toMatch(/description:\s*.+/);
      });

      it('should have required website field', () => {
        expect(frontmatter).toMatch(/website:\s*.+/);
      });
    });
  });
});

const articlesDir = join(process.cwd(), 'src/content/articles');

describe('Article Content', () => {
  const articleFiles = readdirSync(articlesDir).filter(f => f.endsWith('.md'));

  it('should have at least one article', () => {
    expect(articleFiles.length).toBeGreaterThan(0);
  });

  articleFiles.forEach((file) => {
    describe(`Article: ${file}`, () => {
      const content = readFileSync(join(articlesDir, file), 'utf-8');
      const frontmatter = content.split('---')[1];

      it('should have required title field', () => {
        expect(frontmatter).toMatch(/title:\s*.+/);
      });

      it('should have required description field', () => {
        expect(frontmatter).toMatch(/description:\s*.+/);
      });

      it('should have required pubDate field', () => {
        expect(frontmatter).toMatch(/pubDate:\s*.+/);
      });
    });
  });
});

describe('CSS Classes', () => {
  const cssPath = join(process.cwd(), 'src/styles/global.css');
  const cssContent = readFileSync(cssPath, 'utf-8');

  it('should define hero-bg class', () => {
    expect(cssContent).toContain('.hero-bg');
  });

  it('should define responsive breakpoints', () => {
    expect(cssContent).toContain('@media');
  });

  it('should define contact form classes', () => {
    expect(cssContent).toContain('.contact-form-input');
    expect(cssContent).toContain('.contact-heading');
  });

  it('should define FHIR section classes', () => {
    expect(cssContent).toContain('.fhir-section-heading');
    expect(cssContent).toContain('.fhir-section-bg');
  });
});
