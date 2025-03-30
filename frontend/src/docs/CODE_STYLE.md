# Руководство по стилю кода и оптимизации

## Общие компоненты

В проекте используется система переиспользуемых компонентов, которые находятся в директории `src/components/common`. Их следует использовать вместо создания дублирующих компонентов в каждом файле.

### Основные компоненты (`PageElements.js`)

Файл содержит базовые элементы интерфейса:

- `PageContainer` - контейнер для страницы
- `PageHeader`, `Title`, `Subtitle` - компоненты заголовков
- `Button`, `LinkButton` - кнопки и ссылки в виде кнопок
- `FormGroup`, `Label`, `Input`, `Select`, `Textarea` - элементы форм
- `Grid`, `Flex` - компоненты для разметки
- `LoadingSpinner` - индикатор загрузки
- `Alert`, `InfoBox` - компоненты для уведомлений

Пример использования:

```jsx
import {
  PageContainer,
  Title,
  Button,
  FormGroup,
  Input
} from '../components/common/PageElements';

const MyComponent = () => {
  return (
    <PageContainer>
      <Title>Заголовок страницы</Title>
      <FormGroup>
        <Input type="text" placeholder="Введите текст" />
        <Button>Отправить</Button>
      </FormGroup>
    </PageContainer>
  );
};
```

### Макеты страниц (`PageLayouts.js`)

Файл содержит шаблоны страниц, которые инкапсулируют общую структуру разных типов страниц:

- `StandardPage` - стандартный макет с заголовком и основным содержимым
- `TwoColumnPage` - макет с разделением на две колонки
- `BannerPage` - макет с баннером вверху страницы

Пример использования:

```jsx
import { StandardPage } from '../components/common/PageLayouts';
import { Button } from '../components/common/PageElements';

const MyPage = () => {
  return (
    <StandardPage
      title="Заголовок страницы"
      subtitle="Подзаголовок с описанием страницы"
    >
      <p>Содержимое страницы</p>
      <Button>Действие</Button>
    </StandardPage>
  );
};
```

## Структура компонентов

Придерживайтесь следующей структуры при создании новых компонентов:

1. **Импорты**
2. **Стилизованные компоненты** (специфичные для этого файла)
3. **Вспомогательные функции**
4. **Основной компонент**
5. **Экспорт**

Пример:

```jsx
// 1. Импорты
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from './common/PageElements';

// 2. Стилизованные компоненты
const Container = styled.div`
  padding: 1rem;
`;

// 3. Вспомогательные функции
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU');
};

// 4. Основной компонент
const MyComponent = ({ date, onAction }) => {
  const [isActive, setIsActive] = useState(false);
  
  const handleClick = () => {
    setIsActive(!isActive);
    onAction();
  };
  
  return (
    <Container>
      <p>Дата: {formatDate(date)}</p>
      <Button onClick={handleClick}>
        {isActive ? 'Активно' : 'Неактивно'}
      </Button>
    </Container>
  );
};

// 5. Экспорт
export default MyComponent;
```

## Правила оптимизации

### 1. Исключайте дублирование стилей

❌ **Плохо:**

```jsx
// В каждом файле повторяются похожие компоненты
const Button = styled.button`...`;
const Title = styled.h1`...`;
```

✅ **Хорошо:**

```jsx
// Использование общих компонентов
import { Button, Title } from '../components/common/PageElements';
```

### 2. Разделяйте большие компоненты

❌ **Плохо:**

```jsx
// Один компонент делает всё
const Page = () => {
  // 300+ строк кода...
};
```

✅ **Хорошо:**

```jsx
// Разделение на логические части
const FilterSection = () => {...};
const ResultsList = () => {...};

const Page = () => {
  return (
    <>
      <FilterSection />
      <ResultsList />
    </>
  );
};
```

### 3. Используйте CSS переменные

❌ **Плохо:**

```jsx
const Button = styled.button`
  background-color: #217148;
  border-radius: 5px;
`;
```

✅ **Хорошо:**

```jsx
const Button = styled.button`
  background-color: var(--primary-color);
  border-radius: var(--radius-sm);
`;
```

### 4. Отделяйте логику от представления

❌ **Плохо:**

```jsx
const Component = () => {
  // Смешивание логики и представления
  const [data, setData] = useState([]);
  // Сложная логика обработки данных
  
  return (
    <div>
      {/* Сложное представление */}
    </div>
  );
};
```

✅ **Хорошо:**

```jsx
// Выделение логики в хук
const useDataProcessing = () => {
  const [data, setData] = useState([]);
  // Логика обработки данных
  return { data, /* другие данные и методы */ };
};

// Компонент фокусируется на представлении
const Component = () => {
  const { data } = useDataProcessing();
  
  return (
    <div>
      {/* Представление */}
    </div>
  );
};
```

## Производительность

- Используйте `React.memo` для предотвращения лишних перерендеров
- Вынесите сложные вычисления в `useMemo`
- Оптимизируйте обработчики событий с помощью `useCallback`
- Избегайте чрезмерного использования состояний для данных, которые можно вычислить 