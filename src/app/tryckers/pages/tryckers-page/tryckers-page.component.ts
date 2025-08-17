import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Skeleton } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-tryckers-page',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DataViewModule,
    OrderListModule,
    PickListModule,
    SelectButtonModule,
    TagModule,
    Skeleton,
  ],
  templateUrl: './tryckers-page.component.html',
  styles: [
    `
      .tryckers-content {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .hero-section {
        text-align: center;
        padding: 4rem 0;
      }

      .hero-title {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .hero-subtitle {
        font-size: 1.25rem;
        color: #64748b;
        margin-bottom: 2rem;
      }

      .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn-primary {
        background-color: #3b82f6;
        color: white;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
      }

      .btn-primary:hover {
        background-color: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }

      .btn-secondary {
        background-color: transparent;
        color: #3b82f6;
        padding: 0.75rem 2rem;
        border: 2px solid #3b82f6;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
      }

      .btn-secondary:hover {
        background-color: #3b82f6;
        color: white;
        transform: translateY(-2px);
      }
    `,
  ],
})
export default class TryckersPageComponent implements OnInit {
  tryckers: any[] = [];

  ngOnInit(): void {
    this.tryckers = [
      {
        id: 1,
        title: 'ZIRUS16',
        description: 'A simple and fast way to create your own tryckers.',
      },
      {
        id: 2,
        title: 'JULIAN',
        description: 'An advanced tool for creating tryckers with ease.',
      },
      {
        id: 3,
        title: 'SANTIAGO',
        description: 'The ultimate solution for tryckers development.',
      },
      {
        id: 4,
        title: 'TRYCKER',
        description: 'A powerful framework for building tryckers.',
      },
      {
        id: 5,
        title: 'ANGULAR',
        description: 'A modern approach to tryckers creation.',
      },
      {
        id: 6,
        title: 'REACT',
        description: 'A flexible and efficient way to build tryckers.',
      },
    ];
  }
}
