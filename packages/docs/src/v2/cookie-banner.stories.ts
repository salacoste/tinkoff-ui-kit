import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { apiReferenceDoc } from '../../../components/src/api-reference.js';
import { codeBlock, v2PageStyles } from './page-scaffold.js';

import '../../../components/src/cookie-banner/cookie-banner.js';

/**
 * v2 docs page — tk-cookie-banner (spec 8.3): what/when/not-for, live
 * usage, theming, a11y incl. the SR protocol, composition pointers. API
 * table is the generated CEM render; the interactive suite lives at
 * Components/Cookie banner. Content RU, meta EN.
 */

const meta: Meta = {
  title: 'Components v2/Cookie banner',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Page: Story = {
  name: 'Обзор',
  render: () => html`
    ${v2PageStyles}
    <div class="tkv2">
      <h1>Cookie banner — компактный баннер согласия</h1>
      <p class="tkv2-note">
        <code>tk-cookie-banner</code> — НЕмодальный диалог согласия:
        карточка на модальном слое оверлей-контроллера (top-layer), без
        скрима, блокировки скролла и ловушки фокуса, зафиксированная в
        левом нижнем углу вьюпорта. Страница позади остаётся полностью
        интерактивной.
      </p>

      <h2>Когда использовать</h2>
      <ul>
        <li>
          Первое посещение сайта: короткое сообщение о cookies с одной
          кнопкой согласия — компактная альтернатива модальным
          cookie-стенам.
        </li>
        <li>
          Страницы, где нельзя прерывать пользователя: нет ни скрима, ни
          блокировки — баннер присутствует, но не ломает поток.
        </li>
      </ul>

      <h2>Когда НЕ использовать</h2>
      <ul>
        <li>
          Юрисдикции/потоки, требующие равновесного выбора (принять /
          отклонить / настроить): у компонента ОДНА кнопка — согласие как
          позитивный акт; многовариантные consent-диалоги собирайте из
          <code>tk-modal</code>.
        </li>
        <li>
          Любые сообщения, которые надо закрыть крестом или кликом мимо:
          внутренних путей закрытия НЕТ by design (см. ниже).
        </li>
      </ul>

      <h2>Использование</h2>
      <p class="tkv2-note">
        Живой образец открыт и находится в левом нижнем углу вьюпорта
        (позиция fixed) — прокрутите к началу страницы.
      </p>
      ${codeBlock(`<!-- сообщение — light DOM: слот по умолчанию -->
<tk-cookie-banner open>
  Мы используем <a href="/privacy/">куки</a>, чтобы делать сайт удобным
</tk-cookie-banner>

<script type="module">
  import 'pillkit-components';
  const banner = document.querySelector('tk-cookie-banner');
  banner.addEventListener('consent-choice', () => {
    // 1) запишите решение СВОИМ хранилищем (см. договорённость ниже)
    localStorage.setItem('consent', 'accepted');
    // 2) закройте баннер — кит никогда не делает этого сам
    banner.open = false;
  });
</script>`)}
      <tk-cookie-banner open>
        Мы используем
        <a href="#privacy" aria-label="Согласие на обработку данных">куки</a>,
        чтобы делать сайт удобным для вас
      </tk-cookie-banner>
      <div class="tkv2-gotcha">
        <strong>Хранилище — потребителя.</strong> Компонент НЕ читает и НЕ
        пишет ни localStorage, ни cookies — вообще никакого кода хранения
        в нём нет (закреплено структурным юнит-тестом). Показ/скрытие при
        возврате посетителя — тоже забота потребителя: прочитайте СВОЁ
        хранилище и не ставьте <code>open</code>. Согласие — позитивный
        акт: Esc и клик вне карточки НИЧЕГО не закрывают (Esc гасится с
        preventDefault и больше ничего не делает); единственный путь
        закрытия — потребитель переключает <code>open</code> после
        <code>consent-choice</code>. Каждый флип канала — только
        потребительский: <code>open-change</code> возвращает эхо
        mount/release.
      </div>

      <h2>Темизация</h2>
      <p>
        Карточка — <code>surface-base</code> с тенью
        <code>shadow-modal</code> (в тёмной теме тональная ступень вместо
        тени), текст — <code>text-primary</code>/<code>text-secondary</code>
        по §6-хукам для слотированных ссылок. Кнопка согласия — жёлтая
        пилюля с чернильным текстом (инвариантна в обеих темах). Слоты §6:
        <code>--tk-cookie-banner-fill</code>,
        <code>--tk-cookie-banner-text</code>,
        <code>--tk-cookie-banner-link</code>,
        <code>--tk-cookie-banner-accept-fill</code>,
        <code>--tk-cookie-banner-accept-text</code>,
        <code>--tk-cookie-banner-radius</code>,
        <code>--tk-cookie-banner-gap</code>,
        <code>--tk-cookie-banner-max-width</code>.
      </p>

      <h2>Доступность</h2>
      <p>
        Имя диалога — <code>label</code> (aria-label, по умолчанию «Баннер
        согласия использования cookies»). При открытии фокус переходит на
        кнопку согласия (следующий естественный акт), Tab НЕ заворачивается
        — немодальность: фокус свободно уходит на страницу. При закрытии
        фокус возвращается на прежний элемент ТОЛЬКО если он ещё в DOM и
        фокус всё ещё внутри баннера (потребитель, закрывший баннер кликом
        по странице, не дёргается). Полный чек-лист — история
        <a
          href="?path=/story/components-cookiebanner--accessibility"
          target="_top"
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
            <td>Открытие (open=true)</td>
            <td>«Баннер согласия использования cookies, диалог» — имя и роль; фокус на кнопке</td>
          </tr>
          <tr>
            <td>Кнопка</td>
            <td>«Хорошо, кнопка» — доступное имя из accept-label</td>
          </tr>
          <tr>
            <td>Esc при открытом</td>
            <td>ТИШИНА: не закрывает и не объявляет ничего (согласие — только позитивный акт)</td>
          </tr>
          <tr>
            <td>Enter на кнопке</td>
            <td>«нажата кнопка»; приходит consent-choice; баннер остаётся открытым — закрывает потребитель</td>
          </tr>
          <tr>
            <td>Tab из карточки</td>
            <td>фокус уходит на страницу (ловушки нет); Shift+Tab возвращается в карточку</td>
          </tr>
        </tbody>
      </table>

      <h2>В составе</h2>
      <p>
        Сайт-хром, а не блок лендинга: в шоукейсах не участвует. Живые
        состояния (открытие по кнопке, журнал событий, варианты) — на
        странице компонента
        <a href="?path=/story/components-cookiebanner--playground" target="_top"
          >Components/Cookie banner</a
        >.
      </p>
    </div>
    ${apiReferenceDoc('tk-cookie-banner')}
  `,
};
