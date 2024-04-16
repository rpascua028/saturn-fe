
// Components.js
import React from 'react';
import { Input, Tag } from 'antd';
import { SearchOutlined, CheckCircleFilled } from '@ant-design/icons';

export const SearchInput = ({ label, placeholder, searchTerm, onSearchChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ marginRight: 8, whiteSpace: 'nowrap' }}>{label}</span>
    <Input
      placeholder={placeholder}
      value={searchTerm}
      onChange={onSearchChange}
      suffix={<SearchOutlined />}
      style={{
        flex: 1,

        borderRadius: '10px',
        display: 'flex'
      }}
    />
  </div>
);

export const TagsDisplay = ({ tags, selectedTags, onTagToggle }) => (
  <div style={{
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '1px', 
    marginTop: 16, 
    marginBottom: 16, 
    maxHeight: 'calc(5 * 27px)', 
    overflowY: 'auto',
    justifyContent: 'center'
  }}>
    {tags.map((tag) => (
      <Tag.CheckableTag
        key={tag.id}
        checked={selectedTags.includes(tag.id)}
        onChange={(checked) => onTagToggle(tag.id, checked)}
        style={{
          fontSize: '13px',
          marginTop: 3,
          marginBottom: 3,
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: selectedTags.includes(tag.id) ? '#ee7675' : '#feffff',
          color: selectedTags.includes(tag.id) ? '#feffff' : '#d9d9d9',
          border: selectedTags.includes(tag.id) ? '1px solid #e28682' : '1px solid #d9d9d9',
          margin: '2px',
          borderRadius: '15px'
        }}
      >
        {selectedTags.includes(tag.id) && <CheckCircleFilled style={{ fontSize: '10px' }} />}
        {tag.name}
      </Tag.CheckableTag>
    ))}
  </div>
);