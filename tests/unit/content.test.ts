import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
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

describe('Member orgLogos Validation', () => {
  const memberFiles = readdirSync(membersDir).filter(f => f.endsWith('.md'));

  memberFiles.forEach((file) => {
    const content = readFileSync(join(membersDir, file), 'utf-8');
    const frontmatter = content.split('---')[1];

    if (!frontmatter.includes('orgLogos:')) return;

    describe(`${file}: orgLogos`, () => {
      it('should have at least one entry', () => {
        expect(frontmatter).toMatch(/orgLogos:\s*\n\s+- /);
      });

      it('should have a name field in each entry', () => {
        expect(frontmatter).toMatch(/- name:\s*.+/);
      });

      it('should have logo path under /images/org-logos/', () => {
        expect(frontmatter).toMatch(/logo:\s*["']?\/images\/org-logos\//);
      });

      it('should have a https url', () => {
        expect(frontmatter).toMatch(/url:\s*["']?https:\/\//);
      });

      it('should have cardBadge as true or false', () => {
        expect(frontmatter).toMatch(/cardBadge:\s*(true|false)/);
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

/**
 * Collects the `name:` of each orgLogos entry for one member's frontmatter.
 *
 * Scoped to the orgLogos block rather than matching `- name:` across the whole
 * frontmatter: health-samurai.md also uses `- name:` for its services table, so
 * an unscoped match reports its products as badges.
 */
function orgLogoNames(frontmatter: string): string[] {
  const lines = frontmatter.split('\n');
  const start = lines.findIndex((l) => /^orgLogos:\s*$/.test(l));
  if (start === -1) return [];

  const names: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\S/.test(lines[i])) break; // next top-level key closes the block
    const match = lines[i].match(/^\s+- name:\s*["']?(.+?)["']?\s*$/);
    if (match) names.push(match[1]);
  }
  return names;
}

describe('Member org badges', () => {
  const memberFiles = readdirSync(membersDir).filter((f) => f.endsWith('.md')).sort();

  const badgesByFile = new Map(
    memberFiles.map((file) => {
      const content = readFileSync(join(membersDir, file), 'utf-8');
      return [file, orgLogoNames(content.split('---')[1])] as const;
    })
  );

  const carrying = (badge: string) =>
    memberFiles.filter((file) => badgesByFile.get(file)!.includes(badge));

  it('lists HL7 International on exactly these members', () => {
    expect(carrying('HL7 International')).toEqual([
      '1uphealth.md',
      'aegis.md',
      'csiro.md',
      'firely.md',
      'health-samurai.md',
      'healthlx.md',
      'onyx.md',
      'trisotech.md',
    ]);
  });

  it('lists HL7 FAST Accelerator on exactly these members', () => {
    expect(carrying('HL7 FAST Accelerator')).toEqual(['aegis.md']);
  });

  it('stops at the next top-level key instead of reading the block below', () => {
    // health-samurai.md declares `- name:` entries under services as well, and
    // today orgLogos happens to be its last key. Ordering is not a guarantee,
    // so exercise the case directly: a services block following orgLogos.
    const frontmatter = [
      'name: "Example"',
      'orgLogos:',
      '  - name: "HL7 International"',
      '    logo: "/images/org-logos/HL7-IntNoeffects300px.png"',
      '    url: "https://www.hl7.org"',
      '    cardBadge: true',
      'services:',
      '    - name: "Aidbox"',
      '      description: "Not a badge"',
    ].join('\n');

    expect(orgLogoNames(frontmatter)).toEqual(['HL7 International']);
  });

  it('points every badge at a logo file that exists', () => {
    const missing: string[] = [];
    for (const file of memberFiles) {
      const frontmatter = readFileSync(join(membersDir, file), 'utf-8').split('---')[1];
      const lines = frontmatter.split('\n');
      const start = lines.findIndex((l) => /^orgLogos:\s*$/.test(l));
      if (start === -1) continue;
      for (let i = start + 1; i < lines.length; i++) {
        if (/^\S/.test(lines[i])) break;
        const match = lines[i].match(/^\s+logo:\s*["']?(.+?)["']?\s*$/);
        if (match && !existsSync(join(process.cwd(), 'public', match[1]))) {
          missing.push(`${file} -> ${match[1]}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
