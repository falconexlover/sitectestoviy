import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomList from '../pages/RoomList';

// Типизация для состояния компонента
interface AppState {
  isLoading: boolean;
}

// Компонент приложения
class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount(): void {
    // Имитация загрузки данных
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
  }

  render(): React.ReactNode {
    const { isLoading } = this.state;

    if (isLoading) {
      return <div className="loading">Загрузка приложения...</div>;
    }

    return (
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>Гостиничный комплекс "Лесной Дворик"</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<div>Главная страница</div>} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/booking" element={<div>Бронирование</div>} />
              <Route path="/booking/:roomId" element={<div>Бронирование конкретного номера</div>} />
              <Route path="/contacts" element={<div>Контакты</div>} />
              <Route path="*" element={<div>Страница не найдена</div>} />
            </Routes>
          </main>
          <footer>
            <p>© {new Date().getFullYear()} Гостиничный комплекс "Лесной Дворик"</p>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App; 