import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../../../components/src/api-reference.js';
import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/qr-block/qr-block.js';

/**
 * v2 docs page — tk-qr-block (spec 8.3): what/when/not-for, live usage,
 * theming, a11y incl. the SR protocol, composition pointers. API table is
 * the generated CEM render; the interactive suite lives at
 * Components/QR block. Content RU, meta EN.
 */

/** A deterministic neutral QR placeholder (the kit stories' own mold) —
 *  the real encoding is ALWAYS the consumer's. */
const qrPlaceholder = (seed: number): string => {
  const modules: string[] = [];
  for (let y = 0; y < 29; y += 1) {
    for (let x = 0; x < 29; x += 1) {
      const noise = Math.sin(seed * 127.1 + x * 311.7 + y * 74.7) * 43758.5453;
      if (noise - Math.floor(noise) > 0.5) {
        modules.push(`<rect x='${x}' y='${y}' width='1' height='1' fill='black'/>`);
      }
    }
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 29' width='168' height='168'><rect width='29' height='29' fill='white'/>${modules.join('')}</svg>`,
  )}`;
};

const QR_TABS = [
  {
    label: 'Android 9.0 и выше',
    qrSrc: qrPlaceholder(1),
    note: 'Наведите камеру телефона на QR-код, чтобы скачать приложение',
  },
  { label: 'Android ниже 9.0', qrSrc: qrPlaceholder(2) },
];

const meta: Meta = {
  title: 'Components v2/QR block',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>QR block — блок установки по QR-коду</h1>
      <p class="tkv2-note">
        <code>tk-qr-block</code> — секция установки приложения:
        необязательный центрированный заголовок, необязательный абзац
        <code>slot="page-copy"</code> под ним, переключатель двух
        платформ и панели с QR-изображением в белой скруглённой плитке;
        строка безопасности — ПОД плиткой. Переключатель — это сам
        <code>tk-tabs</code>, скомпонованный внутри.
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          «Скачайте приложение» на десктопных страницах: QR ведёт на
          мобильную установку, табы различают версии ОС.
        </li>
        <li>
          Одна-две платформы с разными сборками: контракта табов v1
          достаточно, отдельного канала блок не добавляет.
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          Генерация QR-арта: кит НИКОГДА не кодирует QR —
          <code>qrSrc</code> — готовое изображение потребителя (ваш
          кодировщик, ваша ссылка, ваш контроль ревизий).
        </li>
        <li>
          Три и больше платформ: референс несёт ровно ДВЕ; для длинных
          рядов соберите композицию сами из <code>tk-tabs</code>.
        </li>
      </ul>
      <div class="tkv2-gotcha">
        <strong>Слот page-copy (10.2) закрыл прежний пробел.</strong>
        Абзац между заголовком и переключателем —
        <code>&lt;p slot="page-copy"&gt;</code>: обёртка рендерится ТОЛЬКО
        когда слот непуст. Пробел «описания под заголовком нет», отмеченный
        при композции 7.5, снят этим слотом.
      </div>

      <h2>Использование</h2>
      <div class="tkv2-demo">
        <tk-qr-block
          title="Вариант 2. Отсканируйте QR-код"
          .tabs=${QR_TABS}
        >
          <p slot="page-copy">
            Переходите по ссылкам только с этой страницы и не сканируйте файлы
            с непроверенных сайтов. Версию Android можно посмотреть в
            настройках смартфона — достаточно узнать первую цифру
          </p>
        </tk-qr-block>
      </div>
      ${codeBlock(`<tk-qr-block title="Отсканируйте QR-код">
  <p slot="page-copy">Абзац безопасности между заголовком и табами</p>
</tk-qr-block>

<script type="module">
  import 'pillkit-components';
  document.querySelector('tk-qr-block').tabs = [
    {
      label: 'Android 9.0 и выше',          // имя таба
      qrSrc: '/assets/qr-android.svg',      // ВАША кодировка QR — не генерируется китом
      note: 'Наведите камеру телефона на QR-код',  // необязательная строка под плиткой
    },
    { label: 'Android ниже 9.0', qrSrc: '/assets/qr-android-old.svg' },
  ];
</script>`)}
      <div class="tkv2-gotcha">
        <strong>Договорённости с потребителем.</strong>
        Своего канала значений НЕТ: селекцией управляет скомпонованный
        <code>tk-tabs</code> — его <code>value</code>/
        <code>value-change</code> всплывают из этого shadow root как
        ЕГО собственные события (ничего не переизлучается и не
        мапится). Ключи — ИНДЕКСЫ табов («0», «1»: у TkQrTab поля value
        нет). Alt QR-изображения собирается автоматически из label.
      </div>

      <h2>Темизация</h2>
      <p>
        Плита QR — <code>surface-base</code> с тенью
        <code>shadow-popover</code> (QR-паттерн читается на белом; в тёмной
        теме плита остаётся светлой поверх тёмной страницы — инвариант
        содержимого), заголовок — heading-4, строка безопасности —
        text-secondary. Слоты §6:
        <code>--tk-qr-block-tile-fill</code>,
        <code>--tk-qr-block-tile-radius</code>,
        <code>--tk-qr-block-tile-shadow</code>,
        <code>--tk-qr-block-title</code>,
        <code>--tk-qr-block-note</code>,
        <code>--tk-qr-block-copy</code>. Табы темизуются своими слотами
        (<code>--tk-tabs-*</code>).
      </p>

      <h2>Доступность</h2>
      <p>
        Клавиатурная матрица и семантика — контракт tk-tabs: таб-стопы на
        табах, стрелки ←/→, Home/End, roving-фокус, aria-selected.
        QR-изображение — нативный <code>&lt;img&gt;</code> с alt,
        собираемым автоматически («QR-код для …label»); содержимое
        осмысленно объявляется. Полный чек-лист — история
        <a href="?path=/story/components-qrblock--accessibility" target="_top"
          >«Доступность»</a
        >
        на странице компонента.
      </p>
      <h3>Протокол скринридер-проверки (VoiceOver / NVDA)</h3>
      <table>
        <thead>
          <tr><th>Шаг</th><th>Ожидаемые объявления</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Чтение блока</td>
            <td>«Отсканируйте QR-код, заголовок 4 уровня», затем «список вкладок, 2 вкладки»</td>
          </tr>
          <tr>
            <td>Таб</td>
            <td>«Android 9.0 и выше, вкладка, выбрана 1 из 2»</td>
          </tr>
          <tr>
            <td>→ (стрелка)</td>
            <td>фокус на «Android ниже 9.0»; Space/Enter переключают панель</td>
          </tr>
          <tr>
            <td>QR-изображение</td>
            <td>«QR-код для Android 9.0 и выше, изображение» — alt собирается автоматически; строка безопасности читается текстом</td>
          </tr>
        </tbody>
      </table>

      <h2>В составе</h2>
      <p>
        Кластер установки приложения — сценарий
        <a
          href="?path=/story/showcase-invest-landing--invest-landing"
          target="_top"
          >Showcase/Invest landing</a
        >
        (QR-блок + шаги + бейджи сторов одним кластером).
      </p>
    </div>
    ${apiReferenceDoc('tk-qr-block')}
  `,
};
