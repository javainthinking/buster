'use client';

import { useGetPermissionGroupDatasetGroups } from '@/api/buster_rest';
import { useDebounceSearch } from '@/hooks/useDebounceSearch';
import {
  NewDatasetGroupModal,
  PermissionSearchAndListWrapper
} from '@/components/features/PermissionComponents';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/buttons';
import { PermissionGroupDatasetGroupsListContainer } from './PermissionGroupDatasetsListContainer';
import { useMemoizedFn } from '@/hooks';
import { Plus } from '@/components/ui/icons';

export const PermissionGroupDatasetGroupsController: React.FC<{
  permissionGroupId: string;
}> = ({ permissionGroupId }) => {
  const { data } = useGetPermissionGroupDatasetGroups(permissionGroupId);
  const [isNewDatasetGroupModalOpen, setIsNewDatasetGroupModalOpen] = useState(false);

  const { filteredItems, handleSearchChange, searchText } = useDebounceSearch({
    items: data || [],
    searchPredicate: (item, searchText) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
  });

  const onCloseNewDatasetGroupModal = useMemoizedFn(() => {
    setIsNewDatasetGroupModalOpen(false);
  });

  const onOpenNewDatasetGroupModal = useMemoizedFn(() => {
    setIsNewDatasetGroupModalOpen(true);
  });

  const NewDatasetGroupButton: React.ReactNode = useMemo(() => {
    return (
      <Button prefix={<Plus />} onClick={onOpenNewDatasetGroupModal}>
        New dataset group
      </Button>
    );
  }, []);

  return (
    <>
      <PermissionSearchAndListWrapper
        searchText={searchText}
        handleSearchChange={handleSearchChange}
        searchPlaceholder="Search by permission group name..."
        searchChildren={NewDatasetGroupButton}>
        <PermissionGroupDatasetGroupsListContainer
          filteredDatasetGroups={filteredItems}
          permissionGroupId={permissionGroupId}
        />
      </PermissionSearchAndListWrapper>

      <NewDatasetGroupModal
        isOpen={isNewDatasetGroupModalOpen}
        onClose={onCloseNewDatasetGroupModal}
        datasetId={null}
      />
    </>
  );
};
