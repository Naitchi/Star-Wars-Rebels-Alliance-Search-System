import React from 'react';

// Component
import Card from '../Card/Card';

// Style
import style from './Displayer.module.css';

// Types
import { Items } from '../../types/types';
type DisplayerProps = {
  label: string;
  isLoading: boolean;
  selected: Items;
};

const Displayer: React.FC<DisplayerProps> = ({ label, isLoading, selected }) => {
  const renderContent = () => {
    if (isLoading) {
      return <p className={style.loadingText}>Loading...</p>;
    }
    if (selected.length === 0) {
      return <p className={style.noneText}>None</p>;
    }
    return selected.map((item) => {
      if ('name' in item) {
        return <Card key={item.name} item={item} />;
      } else if ('title' in item) {
        return <Card key={item.title} item={item} />;
      }
    });
  };

  return (
    <div className={style.displayerContainer}>
      <h3 className={style.label}>{label}:</h3>
      <div className={style.contentContainer}>{renderContent()}</div>
    </div>
  );
};

export default Displayer;
