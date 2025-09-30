import { pool } from './server';
import { initDatabase } from './utils/database';

const sampleIdeas = [
  {
    title: 'Добавить темную тему',
    description: 'Реализовать переключатель между светлой и темной темой для улучшения пользовательского опыта'
  },
  {
    title: 'Мобильное приложение',
    description: 'Создать нативное мобильное приложение для iOS и Android'
  },
  {
    title: 'Система уведомлений',
    description: 'Добавить push-уведомления и email-рассылки для важных событий'
  },
  {
    title: 'Интеграция с социальными сетями',
    description: 'Возможность делиться достижениями в Facebook, VK, Instagram'
  },
  {
    title: 'Геймификация',
    description: 'Добавить систему достижений, бейджей и рейтингов пользователей'
  },
  {
    title: 'Офлайн режим',
    description: 'Возможность работы с приложением без подключения к интернету'
  },
  {
    title: 'Голосовые задания',
    description: 'Добавить задания, которые можно выполнять голосом'
  },
  {
    title: 'Многопользовательские игры',
    description: 'Режим соревнований между пользователями в реальном времени'
  },
  {
    title: 'Персонализация контента',
    description: 'Алгоритм рекомендаций на основе предпочтений пользователя'
  },
  {
    title: 'Аналитика прогресса',
    description: 'Детальная статистика обучения с графиками и отчетами'
  },
  {
    title: 'Интеграция с календарем',
    description: 'Планирование занятий и напоминания через календарные приложения'
  },
  {
    title: 'Групповые занятия',
    description: 'Возможность создавать группы и проводить совместные занятия'
  },
  {
    title: 'Экспорт данных',
    description: 'Возможность экспортировать прогресс в PDF или другие форматы'
  },
  {
    title: 'Система наставничества',
    description: 'Связывание опытных пользователей с новичками для помощи в обучении'
  },
  {
    title: 'AR/VR поддержка',
    description: 'Использование дополненной и виртуальной реальности для интерактивного обучения'
  }
];

const seedDatabase = async (): Promise<void> => {
  const client = await pool.connect();
  
  try {
    console.log('Initializing database...');
    await initDatabase();
    
    console.log('Clearing existing data...');
    await client.query('DELETE FROM votes');
    await client.query('DELETE FROM ideas');
    
    console.log('Inserting sample ideas...');
    for (const idea of sampleIdeas) {
      await client.query(
        'INSERT INTO ideas (title, description) VALUES ($1, $2)',
        [idea.title, idea.description]
      );
    }
    
    // Add some random votes to make it more interesting
    console.log('Adding sample votes...');
    const ideas = await client.query('SELECT id FROM ideas');
    const sampleIPs = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1'];
    
    for (let i = 0; i < 50; i++) {
      const randomIdeaId = ideas.rows[Math.floor(Math.random() * ideas.rows.length)].id;
      const randomIP = sampleIPs[Math.floor(Math.random() * sampleIPs.length)];
      
      try {
        await client.query(
          'INSERT INTO votes (idea_id, ip_address) VALUES ($1, $2)',
          [randomIdeaId, randomIP]
        );
        
        await client.query(
          'UPDATE ideas SET votes = votes + 1 WHERE id = $1',
          [randomIdeaId]
        );
      } catch (error) {
        // Ignore duplicate vote errors
        if (!error.message.includes('duplicate key')) {
          throw error;
        }
      }
    }
    
    console.log('Database seeded successfully!');
    console.log(`Added ${sampleIdeas.length} ideas with sample votes`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
