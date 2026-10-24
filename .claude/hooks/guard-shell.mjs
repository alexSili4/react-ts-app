// PreToolUse для Bash і PowerShell. Правила ask у settings.json бачать лише
// інструменти Edit і Write, а shell — ні: `sed -i`, `>`, `Set-Content`,
// `pnpm add` пройшли б без запиту. Тут — запит дозволу, коли команда ставить
// пакети або пише у файл, правка якого — рішення власника (AGENTS.md,
// «Погодження рішень»). Це евристика: скрипт, який сам відкриває файл
// (`node tmp.mjs`), вона не бачить.

const PACKAGES =
  /(?:^|[\s;&|(])(?:npx|pnpx|bunx|(?:npm|pnpm|yarn|bun)\s+(?:i|install|add|uninstall|un|remove|rm|update|up|upgrade|pkg|exec|x|dlx|link))(?=\s|$)/;

// Той самий перелік, що в permissions.ask у settings.json.
const PROTECTED =
  /package(?:-lock)?\.json|vite\.config\.ts|eslint\.config\.js|tsconfig(?:\.node)?\.json|index\.html|main\.tsx|vite-env\.d\.ts|(?:^|[\s"'/\\])scripts[/\\]|\.github|\.claude[/\\]|AGENTS\.md|CLAUDE\.md|ARCHITECTURE\.md|decisions\.md|\.nvmrc|\.prettierrc|\.editorconfig|\.gitignore/;

// Перенаправлення у файл (не 2>&1, не в /dev/null чи $null), правка на місці,
// копіювання й видалення, запис із PowerShell, інлайновий код Node і Python,
// відкат файлів через git.
const WRITE =
  /(?<![\d&=-])>{1,2}(?![&>]|\s*(?:\/dev\/null|\$null|nul\b))|\b(?:sed|perl)\b[^|;&]*\s-[a-zA-Z]*i|\b(?:tee|mv|cp|rm|rmdir|truncate|dd|touch|ln|patch)\b|\b(?:Set|Add|Clear)-Content\b|\bOut-File\b|\b(?:New|Remove|Move|Copy|Rename)-Item\b|\[(?:System\.)?IO\.File\]|\b(?:node|deno)\s+(?:-e|--eval|-p|--print)\b|\bpython[\d.]*\s+-c\b|\bgit\s+(?:checkout|restore|apply|am|reset|stash|mv|rm)\b/;

const ask = (reason) => {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    })
  );
};

const chunks = [];

for await (const chunk of process.stdin) {
  chunks.push(chunk);
}

const command = JSON.parse(Buffer.concat(chunks).toString('utf8')).tool_input?.command ?? '';
const protectedFile = command.match(PROTECTED)?.[0];

if (PACKAGES.test(command)) {
  ask('Команда змінює залежності — це рішення власника (AGENTS.md, «Погодження рішень»).');
} else if (protectedFile && WRITE.test(command)) {
  ask(
    `Команда може змінити ${protectedFile} — правка цього файла є рішенням власника ` +
      '(AGENTS.md, «Погодження рішень»).'
  );
}
